<?php

namespace AppBundle\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\HttpFoundation\JsonResponse;


class DashboardController extends Controller
{

	/**
	 * @Route("/admin/", name="dashboard")
	 * @return Response
	 */
	public function indexAction()
	{
		/*return $this->render( 'dashboard.html.twig', [
			'name' => $slug
		]);*/

		$em = $this->getDoctrine()->getManager();

		$nbSalons = $em->getRepository('AppBundle:Salon')
					   ->createQueryBuilder('t')
					   ->select('count(t.id)')
					   ->getQuery()->getSingleScalarResult();

		$nbOeuvres = $em->getRepository('AppBundle:Oeuvre')
					   ->createQueryBuilder('t')
					   ->select('count(t.id)')
					   ->getQuery()->getSingleScalarResult();

		/*$nbNewRegistration = $em->getRepository('AppBundle:User')
					   ->createQueryBuilder('t')
					   ->select('count(t.id)')
					   ->andWhere('t.date BETWEEN > :lastMonth')
					   ->setParameter('lastMonth', $lastMonth->format('Y-m-d'))
					   ->getQuery()->getSingleScalarResult();*/

		
		/*$data = $em->getRepository('AppBundle:Status')
					->createQueryBuilder('s')
					->select('s.label')
					->getQuery()
					->getResult();*/



        return $this->render('admin/dashboard.html.twig', array(
            'nbSalons' => $nbSalons,
            'nbOeuvres' => $nbOeuvres,
        ));
	}

	/**
	 * @Route("/admin/options", name="options")
	 * @return Response
	 */
	public function optionsAction()
	{
		/*return $this->render( 'dashboard.html.twig', [
			'name' => $slug
		]);*/

		$em = $this->getDoctrine()->getManager();

		$nbSalons = $em->getRepository('AppBundle:Salon')
					   ->createQueryBuilder('t')
					   ->select('count(t.id)')
					   ->getQuery()->getSingleScalarResult();

		$nbOeuvres = $em->getRepository('AppBundle:Oeuvre')
					   ->createQueryBuilder('t')
					   ->select('count(t.id)')
					   ->getQuery()->getSingleScalarResult();


        return $this->render('admin/dashboard.html.twig', array(
            'nbSalons' => $nbSalons,
            'nbOeuvres' => $nbOeuvres,
        ));
	}

    /**
     * @Route("/getDataHighChart", name="data_highchart", options={"expose"=true})
     * @Method({"GET", "POST"})
     */
	public function getDataHighChart(){
		$data = [ 
			'container1' =>[
				'dataPret' => [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
				'dataPasPret' => [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3],
				'dataAPreter'=> [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2],
				'dataCherche'=> [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1],
			],
			'container2' => [
					'data' => [
		            ['Science-fiction'=> 45.0],
		            ['Policier'=> 26.8],
		            [
		                'name'=> 'Manga',
		                'y'=> 12.8,
		                'sliced' => true,
		                'selected' => true
		            ],
		            ['Roman' => 8.5],
		            ['Thriller' => 6.2],
		            ['Autres' => 0.7]
		        ]
			],
			'container3' => [
				'dataSalon' => [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
				'dataUsers' => [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
			],
			'container4' => [
				'usersConnected' => [80],
			],
			'container5' => [
				'data' => [3, 4, 3, 2, 4, 10, 12]
			]
		];

	    return new JsonResponse($data);

	}


}